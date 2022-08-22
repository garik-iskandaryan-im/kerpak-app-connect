const {
    users: Users,
    usersRoles: UsersRoles,
    emailPreferences: EmailPreferences,
} = require('app/models/models');

const { USERS_ROLES } = require('app/constants');

const getSPUsersEmails = async (serviceProviderId, emailPreferencesPayload, usersRoles) => {
    if (!serviceProviderId) {
        return [];
    }
    const payload = { where: {serviceProviderId}, include: []};
    if (usersRoles) {
        payload.include.push({ model: UsersRoles, where: { name: usersRoles }, required:  true });
    }
    if (emailPreferencesPayload) {
        payload.include.push({ model: EmailPreferences, where: emailPreferencesPayload, required:  true });
    }
    const serviceProviders = await Users.findAll(payload);
    return serviceProviders.map(({ email }) => email);
};

const getOperatorsEmails = async (emailPreferencesPayload, onlySuperAdmin) => {
    const payload = {
        include: [
            {
                model: UsersRoles,
                required: true,
                where: {
                    name: onlySuperAdmin ? USERS_ROLES.superAdmin.name : [USERS_ROLES.superAdmin.name, USERS_ROLES.kerpakAdmin.name, USERS_ROLES.kerpakSupport.name]
                }
            }
        ]
    };

    if (emailPreferencesPayload) {
        payload.include.push({ model: EmailPreferences, where: emailPreferencesPayload, required:  true });
    }
    const koUsers = await Users.findAll(payload);
    return koUsers.map(({ email }) => email);
};

const getSPUsersEmailsForTemperatureAlerts = async (serviceProviderId) =>  ({
    spCriticalTemperatureAlertEmails: await getSPUsersEmails(serviceProviderId, {criticalTemperatureAlerts: true}, [USERS_ROLES.accountHolder.name, USERS_ROLES.admin.name]),
});

const getKOEmailsForTemperatureAlerts = async () =>  ({
    koTemperatureEmails: await getOperatorsEmails({temperatureAlerts: true}),
    koCriticalTemperatureEmails: await getOperatorsEmails({criticalTemperatureAlerts: true})
});

module.exports = {
    getSPUsersEmails,
    getSPUsersEmailsForTemperatureAlerts,
    getKOEmailsForTemperatureAlerts
};