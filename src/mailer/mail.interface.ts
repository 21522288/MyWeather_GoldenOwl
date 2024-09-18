import { Address } from "nodemailer/lib/mailer"

export type SendEmailDto = {
    from?: Address,
    recipents:Address[],
    subject:string,
    html:string,
    text?:string,
}