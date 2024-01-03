import { ServiceResponse } from '../Interfaces/service/IService';
import MatchesModel from '../database/models/MatchsModel';
import TeamsModel from '../database/models/TeamsModel';
import { Match } from '../types/Match';

export default class TeamsService {
  constructor(
    private matchesModel = MatchesModel,
    private teamsModel = TeamsModel,
  ) { }

  public async getMatches(): Promise<ServiceResponse<Match[]>> {
    const allMatches = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return { status: 200, data: allMatches };
  }

  public async getMatchesWithProgress(inProgress: boolean): Promise<ServiceResponse<Match[]>> {
    const filteredMatches = await this.matchesModel.findAll({
      where: { inProgress },
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return { status: 200, data: filteredMatches };
  }

  public async finishMatches(id:number): Promise<ServiceResponse<Match[]>> {
    const match = await this.matchesModel.findByPk(id);
    if (!match) {
      return { status: 404, data: { message: 'Match not found' } };
    }
    await match.update({ inProgress: false });
    return { status: 200, data: { message: 'Finished' } };
  }

  public async updateMatches(id:number, homeTeamGoals:number, awayTeamGoals:number)
    : Promise<ServiceResponse<Match[]>> {
    const match = await this.matchesModel.findByPk(id);
    if (!match) {
      return { status: 404, data: { message: 'Match not found' } };
    }
    await match.update({ homeTeamGoals, awayTeamGoals });
    return { status: 200, data: { message: 'Score Updated' } };
  }

  private async validateTeams(homeTeamId: number, awayTeamId: number): Promise<string | undefined> {
    if (homeTeamId === awayTeamId) {
      return 'It is not possible to create a match with two equal teams';
    }

    const homeTeam = await this.teamsModel.findByPk(homeTeamId);
    const awayTeam = await this.teamsModel.findByPk(awayTeamId);
    if (!homeTeam || !awayTeam) {
      return 'There is no team with such id!';
    }
  }

  public async postMatches(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<Match>> {
    const validationError = await this.validateTeams(homeTeamId, awayTeamId);
    if (validationError === 'There is no team with such id!') {
      return { status: 404, data: { message: validationError } };
    } if (validationError === 'It is not possible to create a match with two equal teams') {
      return { status: 422, data: { message: validationError } };
    }

    const newMatch = await this.matchesModel.create({
      homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress: true,
    });
    return { status: 201, data: newMatch };
  }
}
