import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import IIden from "../models/issuer-iden";
import IUser from "../models/issuer-user";
import IUniv from "../models/issuer-univ";
import { assertIsDefined } from "../utils/assert-isdefined";
import { generateIIdenVCJson, generateIUnivVCJson } from "../ssi/vcvp-helper";
import { serializeDIDJsonId } from "../ssi/did-helper";
import * as contractOperation from "../ssi/did-operation";
import { verifySignature } from "../utils/crypto";

export const getAuth: RequestHandler = async (req, res, next) => {
    try {
        const user = await IUser.findById(req.session.userId).select("+didId").exec();
        res.status(200).json(user);
    } catch (error) { next(error); }
};

interface Register { username: string; didId: string; password: string }
export const register: RequestHandler<unknown, unknown, Register, unknown> = async (req, res, next) => {
    try {
        const { username, didId, password: passwordRaw } = req.body;
        if (!username || !passwordRaw || !didId) { throw createHttpError(400, "Parameters missing"); }
        const existingUsername = await IUser.findOne({ username: username }).exec();
        if (existingUsername) { throw createHttpError( 409, "Username already taken. Please choose a different one or log in instead." ); }
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);
        const newIUser = await IUser.create({ username, didId:didId, password: passwordHashed, });
        req.session.userId = newIUser._id;
        res.status(201).json(newIUser);
    } catch (error) { next(error); }
};

interface Login { username: string; password: string }
export const login: RequestHandler<unknown, unknown, Login, unknown> = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) { throw createHttpError(400, "Parameters missing"); }
        const iUser = await IUser.findOne({ username: username }).select("+password +did").exec();
        if (!iUser) { throw createHttpError(401, "Invalid credentials"); }
        const passwordMatch = await bcrypt.compare(password, iUser.password);
        if (!passwordMatch) { throw createHttpError(401, "Invalid credentials"); }
        req.session.userId = iUser._id;
        res.status(201).json(iUser);
    } catch (error) { next(error); }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) { next(error); }
        else { res.sendStatus(200); }
    });
};

export const createIUniv: RequestHandler = async (req, res, next) => {
    const { name, age, gender, graduationDate, major, gpa } = req.body;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if (!name || !age || !gender || !graduationDate || !major || !gpa) { throw createHttpError(400, "Parameters missing"); }
        const newIUniv = await IUniv.create({ userId: authenticatedUserId, name, age, gender, graduationDate, major, gpa });
        res.status(201).json(newIUniv);
    } catch (error) { next(error); }
};

export const createIIden: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { name, age, gender, address } = req.body;
    try {
        assertIsDefined(authenticatedUserId);
        if (!name || !age || !address) { throw createHttpError(400, "Parameters missing"); }
        const newIIden = await IIden.create({ userId: authenticatedUserId, name, age, gender, address });
        res.status(201).json(newIIden);
    } catch (error) { next(error); }
};

export const getIUnivs: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        const iUniv = await IUniv.find({ userId: authenticatedUserId }).exec();
        if (!iUniv) { throw createHttpError(404, "Can't find IUniv"); }
        res.status(200).json(iUniv);
    } catch (error) { next(error); }
};

export const getIIdens: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        const iIden = await IIden.find({ userId: authenticatedUserId }).exec();
        if (!iIden) { throw createHttpError(404, "Can't find IIden"); }
        res.status(200).json(iIden);
    } catch (error) { next(error); }
};

export const authDIDChallenge: RequestHandler = async (req, res, next) => {
    try {
      res.status(200).json(Math.random().toString(36).substring(7));
    } catch (error) { next(error); }
};

export const authDIDResponse: RequestHandler = async (req, res, next) => {
    const { challenge, id, signature } = req.body;
    const didSerializedId = serializeDIDJsonId(id);
    try {
      const didJson = await contractOperation.getDID(1, didSerializedId);
      const publicKey = Object(didJson.publicKey[0]);
      const isValid = await verifySignature(challenge, signature, publicKey.publicKeyPem);
      res.status(200).json(isValid);
    } catch (error) { next(error); }
};

interface IssueVCInput { type: string; vcType: string, holderDIDId: string; issuerDIDId: string; issuerPrivateKeyPem: string }
export const issueVC: RequestHandler<unknown, unknown, IssueVCInput, unknown> = async (req, res, next) => {
    const { type, vcType, issuerDIDId, issuerPrivateKeyPem, holderDIDId } = req.body;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        if (!type || !vcType|| !issuerDIDId || !issuerPrivateKeyPem || !holderDIDId) { throw createHttpError(400, "Parameters missing"); }
        if(vcType == "IUniv"){
            const iUniv = await IUniv.findOne({ userId: authenticatedUserId }).exec();
            if (!iUniv) { throw createHttpError(404, "Can't find IUniv"); }
            const iUnivSubjectData = { name: iUniv.name, age: iUniv.age, gender: iUniv.gender, graduationDate: iUniv.graduationDate, major: iUniv.major, gpa: iUniv.gpa };
            const iUnivVC = await generateIUnivVCJson(issuerDIDId, issuerPrivateKeyPem, authenticatedUserId.toString(), holderDIDId, iUnivSubjectData, type);
            res.status(200).json(iUnivVC);
        }
        else if (vcType === "IIden") {
            const iIden = await IIden.findOne({ userId: authenticatedUserId }).exec();
            if (!iIden) { throw createHttpError(404, "Can't find IUniv"); }
            const iIdenSubjectData = { name: iIden.name, age: iIden.age, gender: iIden.gender, address: iIden.address }
            const iIdenVC = await generateIIdenVCJson(issuerDIDId, issuerPrivateKeyPem, authenticatedUserId.toString(), holderDIDId, iIdenSubjectData, type);
            res.status(200).json(iIdenVC)
        }
        else { throw createHttpError(400, "Check VC type") }
    } catch (error) { next(error); }
};