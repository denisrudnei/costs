import { Team } from '../models/Team';
import { TeamCreateInput } from '../inputs/TeamCreateInput';
import { User } from '../models/User';

export class TeamService {
  public static getTeams() {
    return Team.find();
  }

  public static async getTeam(id: Team['id']) {
    const team = await Team.findOne(id);
    if (!team) throw new Error('Team not found');
    return team;
  }

  public static async getTeamsForUser(id: User['id']) {
    return Team.find({
      where: {
        leader: id,
      },
    });
  }

  public static async createTeam(teamInput: TeamCreateInput) {
    const team = Team.create();
    const leader = await User.findOne(teamInput.leader, { relations: ['leaderOf'] });
    if (!leader) throw new Error('Leader not found');

    team.leader = leader;
    leader.leaderOf.push(team);
    team.name = teamInput.name;

    const newTeam = await team.save();

    await leader.save();

    return newTeam;
  }

  public static async updateLeader(id: Team['id'], userId: User['id']) {
    const team = await Team.findOne(id, { relations: ['leader'] });
    if (!team) throw new Error('Team not found');

    const user = await User.findOne(userId, { relations: ['leaderOf'] });
    if (!user) throw new Error('User not found');

    const oldUser = await User.findOne(team.leader.id, { relations: ['leaderOf'] });

    oldUser!.leaderOf = oldUser!.leaderOf.filter((teamForUser) => teamForUser.id !== id);

    await oldUser!.save();

    user.leaderOf.push(team);
    team.leader = user;

    return team.save();
  }

  public static async addUser(id: Team['id'], userId: User['id']) {
    const team = await Team.findOne(id, { relations: ['members'] });
    if (!team) throw new Error('Team not found');

    const user = await User.findOne(userId, { relations: ['memberOf'] });
    if (!user) throw new Error('User not found');

    team.members.push(user);
    user.memberOf.push(team);

    await user.save();

    return team.save();
  }

  public static async removeUser(id: Team['id'], userId: User['id']) {
    const team = await Team.findOne(id, { relations: ['members'] });
    if (!team) throw new Error('Team not found');

    const user = await User.findOne(userId, { relations: ['memberOf'] });
    if (!user) throw new Error('User not found');

    user.memberOf = user.memberOf.filter((team) => team.id !== id);

    await user.save();

    team.members = team.members.filter((member) => member.id !== Number(userId));

    return team.save();
  }
}
