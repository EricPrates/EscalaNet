import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Material } from "./material.model";
import { CriarMaterialDTO, FiltrosMaterialDTO, RespostaMaterialDTO } from "./material.schemas";

export interface IMaterialRepository extends IBaseRepository<Material, CriarMaterialDTO> {
}

export interface IMaterialService extends IBaseService<RespostaMaterialDTO, FiltrosMaterialDTO, CriarMaterialDTO, number> {
}