import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm";
import { User } from "../../user/user.entity"
import { Request, Response, NextFunction } from "express"

@Injectable()
export class ValidUserMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}
     async use(req: Request, res: Response, next: NextFunction) {
         const userId = parseInt(req.params.userId);
         const userExists = await this.userRepository.findOne({id: userId});
         if(!userExists) {
             throw new HttpException("Student not found", 400);
         }
         next();
     }
}