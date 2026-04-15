import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthContext } from './util.types';
dotenv.config();


export default function generateToken(payload: AuthContext): string {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET || 'default_secret',
        {
            expiresIn: '1h',
            algorithm: 'HS256'
        }
    );
    
}
