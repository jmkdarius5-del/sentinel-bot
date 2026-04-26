module.exports = [
  {
    name: "ping",
    description: "Check bot status"
  },
  {
    name: "genkey",
    description: "Generate a key (admin only)"
  },
  {
    name: "redeem",
    description: "Redeem a key",
    options: [
      {
        name: "key",
        type: 3,
        description: "Enter your key",
        required: true
      }
    ]
  }
];
