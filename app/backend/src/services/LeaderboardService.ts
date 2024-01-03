import ILeaderboard from '../Interfaces/ILeaderboard';
import MatchsModel from '../database/models/MatchsModel';
import { Match } from '../types/Match';
import Team from '../database/models/TeamsModel';

export default class LeaderboardService {
  private static goalsFavor: number;
  private static goalsOwned: number;
  private static totalPoints: number;
  private static totalGames: number;

  constructor() {
    LeaderboardService.goalsFavor = 0;
    LeaderboardService.goalsOwned = 0;
  }

  public static async findAll(): Promise<ILeaderboard[]> {
    const allTeams = await Team.findAll();
    const allMatches = await MatchsModel.findAll(); // Fetch all matches

    const finishedMatches = allMatches.filter((match) => !match.inProgress);

    const all = allTeams.map(({ id, teamName }) => ({
      name: teamName,
      totalPoints: LeaderboardService.calculateTotalPoints(id, finishedMatches),
      totalGames: LeaderboardService.calculateTotalGames(id, finishedMatches),
      totalVictories: LeaderboardService.calculateTotalVictories(id, finishedMatches),
      totalDraws: LeaderboardService.calculateTotalDraws(id, finishedMatches),
      totalLosses: LeaderboardService.calculateTotalLosses(id, finishedMatches),
      goalsFavor: LeaderboardService.calculateGoalsFavor(id, finishedMatches),
      goalsOwn: LeaderboardService.calculateGoalsOwn(id, finishedMatches),
      goalsBalance: LeaderboardService.calculateGoalsBalance(),
      efficiency: LeaderboardService.calculateEfficiency(),
    })).sort((a, b) => LeaderboardService.sort(a, b));
    return all;
  }

  public static calculateTotalPoints(id: number, allMatches: Match[]): number {
    let total = 0;
    allMatches.filter(({ homeTeamId }) => homeTeamId === id)
      .forEach(({ homeTeamGoals, awayTeamGoals }) => {
        if (homeTeamGoals > awayTeamGoals) total += 3;
        if (homeTeamGoals === awayTeamGoals) total += 1;
      });
    LeaderboardService.totalPoints = total;
    return total;
  }

  public static calculateTotalGames(id: number, allMatches: Match[]): number {
    const total = allMatches.filter(({ homeTeamId }) => homeTeamId === id).length;
    LeaderboardService.totalGames = total;
    return total;
  }

  public static calculateTotalVictories(id: number, allMatches: Match[]): number {
    return allMatches.filter(({ homeTeamId, homeTeamGoals, awayTeamGoals,
    }) => homeTeamId === id && homeTeamGoals > awayTeamGoals).length;
  }

  public static calculateTotalDraws(id: number, allMatches: Match[]): number {
    return allMatches.filter(({ homeTeamId, homeTeamGoals, awayTeamGoals,
    }) => homeTeamId === id && homeTeamGoals === awayTeamGoals).length;
  }

  public static calculateTotalLosses(id: number, allMatches: Match[]): number {
    return allMatches.filter(({ homeTeamId, homeTeamGoals, awayTeamGoals,
    }) => homeTeamId === id && homeTeamGoals < awayTeamGoals).length;
  }

  public static calculateGoalsFavor(id: number, allMatches: Match[]): number {
    let total = 0;
    allMatches.filter(({ homeTeamId }) => homeTeamId === id)
      .forEach(({ homeTeamGoals }) => {
        total += homeTeamGoals;
      });
    LeaderboardService.goalsFavor = total;
    return total;
  }

  public static calculateGoalsOwn(id: number, allMatches: Match[]): number {
    let total = 0;
    allMatches.filter(({ homeTeamId }) => homeTeamId === id)
      .forEach(({ awayTeamGoals }) => {
        total += awayTeamGoals;
      });
    LeaderboardService.goalsOwned = total;
    return total;
  }

  public static calculateGoalsBalance() {
    return LeaderboardService.goalsFavor - LeaderboardService.goalsOwned;
  }

  public static calculateEfficiency(): number {
    const maxPossiblePoints = LeaderboardService.totalGames * 3;
    if (maxPossiblePoints === 0) {
      return 0;
    }
    const efficiency = (LeaderboardService.totalPoints / maxPossiblePoints) * 100;
    return parseFloat(efficiency.toFixed(2));
  }

  public static sort(a: ILeaderboard, b: ILeaderboard): number {
    // ordenação decrescente totalPoints
    if (a.totalPoints > b.totalPoints) return -1;
    if (a.totalPoints < b.totalPoints) return 1;

    // ordenação decrescente totalVictories
    if (a.totalVictories > b.totalVictories) return -1;
    if (a.totalVictories < b.totalVictories) return 1;

    // ordenação decrescente goalsBalance
    if (a.goalsBalance !== undefined && b.goalsBalance !== undefined) {
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
    }

    // ordenação descrescente goalsFavor
    if (a.goalsFavor > b.goalsFavor) return -1;
    if (a.goalsFavor < b.goalsFavor) return 1;

    return 0; // time empatado
  }
}

// novo commmit para tentar atualizar o course
