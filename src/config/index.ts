import dotenv from "dotenv";
dotenv.config();

export const config  = {
    app: {
        frontend_url: process.env.FRONTEND_URL || 'http://127.0.0.1',
        backend_url: process.env.BACKEND_URL || 'http://127.0.0.1/api/',
    },
    auth: {
        jwt_secret: process.env.JWT_SECRET || 'saafghiuhbnbkjkhh',
        jwt_expire_in: '20hr',
        jwt_expire_in_for_reset_password: '5min',
        jwt_expire_in_for_enrollment: '7d'
    },
    http: {
        port: process.env.PORT || 8080,
    },
    db: {
        connect_string: process.env.DB_URI || null,
    },
    mail: {
        host: 'smtpcp.evervent.in',
        port: 587,
        secure: false,
        auth: {
            user: 'noreply@evervent.in',
            pass: 'hpn4fiW_3k' 
        },
        tls: {
            rejectUnauthorized: false
        },
        senderEmail: 'noreply@evervent.in'
    }
}

