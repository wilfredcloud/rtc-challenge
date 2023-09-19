import { Router } from "express";
import Joi from "joi";
import { createNewAccount, signIn } from "../services/AuthService";

const authRouter = Router()

authRouter.post('/signup', async (req, res, next) => {

    const signupSchema = Joi.object({
        name: Joi.string().required().max(200),
        email: Joi.string().required().email().max(100),
        password: Joi.string().max(16).min(4)
    });

    const {error, value} = signupSchema.validate(req.body);
    if (error) {
        res.status(403).send(error.details);
    }else{
       try {
        const result = await createNewAccount(value);
        res.send(result)
       } catch (error) {
        next(error)
       }
    }

})


authRouter.post("/signin", async (req, res, next) => {
    const signinSchema = Joi.object({
        email: Joi.string().required().email().max(100),
        password: Joi.string().max(16).min(4)
    });

    const {error, value} = signinSchema.validate(req.body);

    if (error) {
        res.status(403).send(error.details);
    }else{
       try {
        const result = await signIn(value);
        res.send(result)
       } catch (error) {
        next(error)
       }
    }
})

export default authRouter;
