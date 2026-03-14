"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeAccountService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../user/user.model");
const stripeAccount_utils_1 = require("./stripeAccount.utils");
const env_1 = require("../../config/env");
const stripe_config_1 = __importDefault(require("../../config/stripe.config"));
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const createConnectedStripeAccount = (user, host, protocol) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const existingAccount = yield user_model_1.UserModel.findById(user.id);
    const baseUrl = env_1.envVar.BACKEND_URL;
    if (existingAccount && ((_a = existingAccount.stripeAccountInfo) === null || _a === void 0 ? void 0 : _a.stripeAccountId)) {
        const onboardingLink = yield stripe_config_1.default.accountLinks.create({
            account: (_b = existingAccount.stripeAccountInfo) === null || _b === void 0 ? void 0 : _b.stripeAccountId,
            refresh_url: `${baseUrl}/api/v1/stripe/refreshAccountConnect/${existingAccount.stripeAccountInfo.stripeAccountId}`,
            return_url: `${baseUrl}/api/v1/stripe/success-account/${existingAccount.stripeAccountInfo.stripeAccountId}`,
            type: 'account_onboarding',
        });
        // console.log('onboardingLink-1', onboardingLink);
        return {
            success: true,
            message: 'Please complete your account',
            url: onboardingLink.url,
        };
    }
    else {
        const account = yield stripe_config_1.default.accounts.create({
            type: 'express',
            email: user.email,
            country: 'US',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
        yield user_model_1.UserModel.findByIdAndUpdate(user.id, { $set: { stripeAccountInfo: { stripeAccountId: account.id } } });
        const onboardingLink = yield stripe_config_1.default.accountLinks.create({
            account: account.id,
            refresh_url: `${baseUrl}/api/v1/stripe/refreshAccountConnect/${account.id}`,
            return_url: `${baseUrl}/api/v1/stripe/success-account/${account.id}`,
            type: 'account_onboarding',
        });
        return {
            success: true,
            message: 'Please complete your account',
            url: onboardingLink.url,
        };
    }
});
const refreshAccountConnect = (id, host, protocol) => __awaiter(void 0, void 0, void 0, function* () {
    const onboardingLink = yield stripe_config_1.default.accountLinks.create({
        account: id,
        refresh_url: `${protocol}://${host}/api/v1/stripe/refreshAccountConnect/${id}`,
        return_url: `${protocol}://${host}/api/v1/stripe/success-account/${id}`,
        type: 'account_onboarding',
    });
    return onboardingLink.url;
});
const onConnectedStripeAccountSuccess = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ accountId });
    if (!accountId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'account Id not found');
    }
    const stripeAccounts = yield user_model_1.UserModel.findOne({ stripeAccountInfo: { stripeAccountId: accountId } });
    if (!stripeAccounts) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'account not found');
    }
    yield user_model_1.UserModel.updateOne({ stripeAccountInfo: { stripeAccountId: accountId } }, { isCompleted: true });
    const userUpdate = yield user_model_1.UserModel.findByIdAndUpdate(stripeAccounts._id, { $set: { stripeConnectedAccount: accountId } }, { new: true });
    if (!userUpdate) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    // const user = stripeAccounts.userId as unknown as TPopulatedUser;
    const html = (0, stripeAccount_utils_1.successHTMLstripeConnection)({
        name: userUpdate.name,
        email: userUpdate.email,
        image: `${env_1.envVar.BACKEND_URL}${userUpdate.image}`,
        dashboardLink: `${env_1.envVar.FRONTEND_URL_DASHBOARD}/seller/overview`,
    });
    // const data = { user: { name: user.full_name } };
    // io.emit('join stripe account', data);
    return html;
});
const stripeLoginLink = (userPayload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = userPayload.id;
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    // check if shop owner has stripe connected account
    const hasStripeAccount = yield user_model_1.UserModel.findOne({ "stripeAccountInfo.stripeAccountId": (_a = user.stripeAccountInfo) === null || _a === void 0 ? void 0 : _a.stripeAccountId });
    if (!hasStripeAccount) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Stripe account not found');
    }
    const stripeAccountId = ((_b = hasStripeAccount === null || hasStripeAccount === void 0 ? void 0 : hasStripeAccount.stripeAccountInfo) === null || _b === void 0 ? void 0 : _b.stripeAccountId) || '';
    const loginLink = yield stripe_config_1.default.accounts.createLoginLink(stripeAccountId);
    return loginLink.url;
});
exports.stripeAccountService = {
    createConnectedStripeAccount,
    refreshAccountConnect,
    onConnectedStripeAccountSuccess,
    stripeLoginLink,
};
