import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Time } from "./time.model";
import { CriarTimeDTO, FiltrosTimeDTO, RespostaTimeDTO } from "./time.schemas";

export interface ITimeRepository extends IBaseRepository<Time, CriarTimeDTO> {
}

export interface ITimeService extends IBaseService<RespostaTimeDTO, FiltrosTimeDTO, CriarTimeDTO, number> {
}
