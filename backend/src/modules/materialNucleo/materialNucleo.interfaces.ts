import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Material } from "./Material";
import { CriarMaterialDTO, FiltrosMaterialDTO, RespostaMaterialDTO } from "./materialNucleo.schemas";

export interface IMaterialNucleoRepository extends IBaseRepository<Material, CriarMaterialDTO> {
}

export interface IMaterialNucleoService extends IBaseService<RespostaMaterialDTO, FiltrosMaterialDTO, CriarMaterialDTO, number> {
}