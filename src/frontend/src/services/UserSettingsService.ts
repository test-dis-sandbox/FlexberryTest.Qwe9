import instance from '@/api/instance';
import { UserSettingDto } from '@/hooks/useUserSettings';

export class UserSettingsService {
  static async getUserSettings(moduleName: string, settingNames: string[]) {
    const query = settingNames.map((s) => `settingNames=${s}`).join('&');
    const { data } = await instance.get<UserSettingDto[]>(`/usersettings/${moduleName}?${query}`);
    return data;
  }

  static async updateUserSetting(setting: UserSettingDto) {
    await instance.put(`/usersettings`, setting, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static async deleteAllUserSettings(moduleName: string) {
    await instance.post('/usersettings/deleteall', JSON.stringify(moduleName), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
