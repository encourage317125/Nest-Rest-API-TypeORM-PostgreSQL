import { Data} from "../../models";
import { Injectable } from '@nestjs/common';
import { Constants } from '../../util/constants';

import { EntityRepository, EntityManager} from "typeorm";
import { Recording } from "../../models/";
// import { GoogleCloudStorage } from "../googlecloud/";

@EntityRepository()
@Injectable()
export class RecordingFacade {

    constructor(
        private entityManager: EntityManager
    ) { }
        // private googleCloudStorage: GoogleCloudStorage) { }


    async findAllAccount(accountId: number) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Recording, "reco")
            .leftJoinAndSelect("reco.account", "account")
            .where("account.id = :accountId ")
            .setParameters({ accountId })
            .getMany();
    }
    async findById(accountId: number, recoId: number) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Recording, "reco")
            .leftJoinAndSelect("reco.account", "account")
            .where("account.id = :accountId ")
            .andWhere("reco.id = :recoId ")
            .setParameters({ accountId, recoId })
            .getMany();
    }
    async findByName(accountId: number, recoName: string) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Recording, "reco")
            .leftJoinAndSelect("reco.account", "account")
            .where("account.id = :accountId ")
            .andWhere("lower(reco.name) = lower(:recoName) ")
            .setParameters({ accountId, recoName: recoName.trim() })
            .getMany();
    }

    async addRecording(file, url, currentUser) {
        let type = new Data();
        let manager = await this.entityManager;
        let recording = new Recording();
        type.id = Constants.RECORDING_FILE_TYPE;
        recording.path=file.path;
        recording.name=file.originalname;
        recording.url=url;
        recording.type=type;
        recording.account=currentUser.accountId;
        recording.user=currentUser.userId;
        recording.creation=new Date();
        recording.updated=new Date();
        recording.metadata='';
        return await manager.save(recording);
    }

    // async create(currentUser, recordingBody, files) {
    //     console.log("recording", recordingBody);
    //     console.log("files", files);

    //     let uploadRecording = async () => {
    //         if (!files["recording"] || !files["recording"][0]) {
    //             throw new MessageCodeError("recording:file:NotFound");
    //         }
    //         let file = files["recording"][0];
    //         let path = currentUser.accountNumber + "/recordings/";
    //         let name = SlugHelper.makeSlug(recordingBody.name);
    //         return Config.string("CDN_HOST", "https://storage.googleapis.com/") + await this.googleCloudStorage.uploadFilePublic(file.path, path + name)
    //     }
    //     let manager = await this.entityManager;
    //     if (!recordingBody || !recordingBody.name) {
    //         throw new MessageCodeError("name:NotFound");
    //     }
    //     if (!files["recording"] || !files["recording"][0]) {
    //         throw new MessageCodeError("recording:file:NotFound");
    //     }
    //     let recording = new Recording();
    //     recording.name = recordingBody.name;
    //     recording.account = Account.withId(currentUser.accountId);
    //     recording.user = User.withId(currentUser.userId);
    //     try {
    //         recording.url = await uploadRecording();
    //         recording.path = files["recording"][0].path
    //     } catch (error) {
    //         console.log("ERROR SUBIENDO recording", error);
    //     }

    //     return await manager.save(recording);
    // }

}