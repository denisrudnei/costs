import {
  Arg, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root,
} from 'type-graphql';

import { Role } from '../enums/Role';
import { TeamCreateInput } from '../inputs/TeamCreateInput';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { TeamService } from '../services/TeamService';
import { CustomExpressContext } from '../types/CustomSession';

@Resolver(() => Team)
export class TeamResolver {
  @Query(() => [Team])
  @Authorized(Role.USER)
  public GetTeams() {
    return TeamService.getTeams();
  }

  @Query(() => Team)
  @Authorized(Role.USER)
  public GetTeam(@Arg('id', () => ID) id: Team['id']) {
    return TeamService.getTeam(id);
  }

  @Query(() => [Team])
  @Authorized(Role.USER)
  public GetTeamsForUser(@Arg('user', () => ID) id: User['id']) {
    return TeamService.getTeamsForUser(id);
  }

  @Query(() => [Team])
  @Authorized(Role.USER)
  public GetMyTeams(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TeamService.getTeamsForUser(id);
  }

  @Mutation(() => Team)
  @Authorized(Role.ADMIN)
  public CreateTeam(@Arg('team', () => TeamCreateInput) team: TeamCreateInput) {
    return TeamService.createTeam(team);
  }

  @Mutation(() => Team)
  @Authorized(Role.ADMIN)
  public UpdateTeamName(@Arg('team', () => ID) id: Team['id'], @Arg('name') name: string) {
    return TeamService.updateName(id, name);
  }

  @Mutation(() => Team)
  @Authorized(Role.ADMIN)
  public AddUserInTeam(@Arg('team', () => ID) id: Team['id'], @Arg('user', () => ID) userId: User['id']) {
    return TeamService.addUser(id, userId);
  }

  @Mutation(() => Team)
  @Authorized(Role.ADMIN)
  public RemoveUserForTeam(@Arg('team', () => ID) id:Team['id'], @Arg('user', () => ID) userId: User['id']) {
    return TeamService.removeUser(id, userId);
  }

  @Mutation(() => Team)
  @Authorized(Role.ADMIN)
  public UpdateLeaderForTeam(@Arg('team', () => ID) team: Team['id'], @Arg('user', () => ID) userId: User['id']) {
    return TeamService.updateLeader(team, userId);
  }

  @FieldResolver()
  public async leader(@Root() root: Team) {
    const { leader } = await Team.findOne(root.id, { relations: ['leader'] }) as Team;
    return leader;
  }

  @FieldResolver()
  public async members(@Root() root: Team) {
    const { members } = await Team.findOne(root.id, { relations: ['members'] }) as Team;
    return members;
  }
}
