import { ServiceResponse } from '../Interfaces/service/IService';
import TeamsModel from '../database/models/TeamsModel';
import { Team } from '../types/Team';
import ITeam from '../Interfaces/ITeam';

export default class TeamsService {
  constructor(
    private teamsModel = TeamsModel,
  ) { }

  public async getTeams(): Promise<ServiceResponse<Team[]>> {
    const allTeams = await this.teamsModel.findAll();
    return { status: 200, data: allTeams };
  }

  public async getById(id: number): Promise<ServiceResponse<ITeam | string>> {
    const teamById = await this.teamsModel.findByPk(id);

    if (!teamById) {
      return { status: 404, data: 'Time não encontrado' };
    }

    return { status: 200, data: teamById };
  }
}
