import { Dashboard } from '../types/Dashboard';
import { User } from '../models/User';
import { Cost } from '../models/Cost';

class DashboardService {
  public static async getDashboard(): Promise<Dashboard> {
    return {
      quantities: [
        {
          name: 'users',
          total: await User.count(),
        },
        {
          name: 'costs',
          total: await Cost.count(),
        },
      ],
    };
  }
}

export default DashboardService;
