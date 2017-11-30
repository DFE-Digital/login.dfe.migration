const getServicesForInvitation = async () => Promise.resolve([
  {
    invitationId: '8226a3d1-823a-4e52-83b3-6e6a117cef0f',
    role: {
      id: 0,
      name: 'End user',
    },
    service: {
      id: 'e10ceae4-8ee7-49ec-880b-20db7e2bf854',
      name: 'Static service',
    },
    organisation: {
      id: '017e5ecd-1504-42d3-a8ab-8446e3099e0f',
      name: 'Static organisation',
    },
  },
]);

module.exports = {
  getServicesForInvitation,
};
