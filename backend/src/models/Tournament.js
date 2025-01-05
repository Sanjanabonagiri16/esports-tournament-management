const mongoose = require('mongoose');

const prizeDistributionSchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const streamingSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['TWITCH', 'YOUTUBE', 'OTHER'],
    required: true
  },
  channelUrl: {
    type: String,
    required: true
  },
  streamKey: String
});

const participantSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'REFUNDED'],
    default: 'PENDING'
  },
  entryFeeTransaction: String
});

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  game: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  maxTeams: {
    type: Number,
    required: true
  },
  prizePool: {
    type: Number,
    default: 0
  },
  prizeDistribution: [prizeDistributionSchema],
  format: {
    type: String,
    enum: ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'],
    required: true
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED'],
    default: 'UPCOMING'
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }],
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED'],
    default: 'PENDING'
  },
  streaming: streamingSchema,
  paymentInfo: {
    stripeAccountId: String,
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING'
    },
    transactions: [{
      type: {
        type: String,
        enum: ['ENTRY_FEE', 'PRIZE_PAYOUT'],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        required: true
      },
      stripePaymentId: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  socialMedia: {
    twitter: String,
    discord: String,
    facebook: String
  },
  gameApiConfig: {
    gameId: String,
    apiKey: String,
    region: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [participantSchema],
  bracketType: {
    type: String,
    enum: ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN', 'SWISS'],
    required: true
  },
  rounds: [{
    number: Number,
    matches: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    }],
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PENDING'
    }
  }],
  entryFee: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  payouts: [{
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    amount: Number,
    position: Number,
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING'
    },
    transactionId: String,
    payoutDate: Date
  }],
  registrationSettings: {
    requireApproval: {
      type: Boolean,
      default: false
    },
    maxTeamSize: {
      type: Number,
      required: true
    },
    minTeamSize: {
      type: Number,
      required: true
    },
    allowSubstitutes: {
      type: Boolean,
      default: true
    },
    maxSubstitutes: {
      type: Number,
      default: 2
    }
  }
}, {
  timestamps: true
});

tournamentSchema.methods.registerTeam = async function(teamId) {
  // Implementation for team registration
};

tournamentSchema.methods.updateBracket = async function(matchResults) {
  // Implementation for bracket updates
};

tournamentSchema.methods.processPrizeDistribution = async function() {
  // Implementation for prize distribution
};

module.exports = mongoose.model('Tournament', tournamentSchema); 