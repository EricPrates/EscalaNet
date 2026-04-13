import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthContext} from '../types/util.types';
dotenv.config();


export const generateToken = (payload: AuthContext)  => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET || 'default_secret',
        {
            expiresIn: '1h',
            algorithm: 'HS256'
        }
    );
    
}
