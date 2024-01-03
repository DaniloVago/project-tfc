import { Team } from '../../types/Team';
import ITeam from '../ITeam';

export type ServiceMessage = { message: string };

export type ServiceResponse<T> = {
  status: number;
  data: T | ServiceMessage | { token: string } | { role: string };
};

export interface IService {
  getTeams(): Promise<ServiceResponse<Team[]>>;
  getById(id: number): Promise<ServiceResponse<ITeam | string>>;
}
