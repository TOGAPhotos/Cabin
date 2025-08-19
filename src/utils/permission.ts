export default class Permission {
  static readonly user = "USER";
  static readonly media = "MEDIA";
  static readonly database = "DATABASE";
  static readonly screener1 = "SCREENER_1";
  static readonly screener2 = "SCREENER_2";
  static readonly admin = "ADMIN";
  static readonly ROLE_LIST = [
    Permission.user,
    Permission.media,
    Permission.database,
    Permission.screener1,
    Permission.screener2,
    Permission.admin,
  ];
  static check(require: string, user: string) {
    const userRoleIndex = Permission.ROLE_LIST.indexOf(user);
    const requireRoleIndex = Permission.ROLE_LIST.indexOf(require);
    return userRoleIndex >= requireRoleIndex;
  }
  static isStaff(user: string) {
    return (
      Permission.ROLE_LIST.indexOf(user) >
      Permission.ROLE_LIST.indexOf(Permission.user)
    );
  }
}
