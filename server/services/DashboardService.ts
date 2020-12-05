import { Dashboard } from '../types/Dashboard';
import { User } from '../models/User';
import { Cost } from '../models/Cost';
import { Forecast } from '../models/Forecast';
import { Loan } from '../models/Loan';

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
        {
          name: 'Forecasts',
          total: await Forecast.count(),
        },
        {
          name: 'Loans',
          total: await Loan.count(),
        },
      ],
    };
  }
}

export default DashboardService;
