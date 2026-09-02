// coopseva-store.js
const DEFAULT_STATE = {
  jobs: [
    {
      id: 'JOB-2026-081',
      customerName: 'Sanjay Verma',
      phone: '+91 98765 43210',
      address: 'Plot 42, Gomti Nagar, Lucknow',
      problemText: 'Water pump tripping circuit breaker repeatedly',
      skill: 'Electrician',
      status: 'Upcoming',
      workerId: 'W-104',
      workerName: 'Ravi Kumar',
      grossFee: 600,
      workerPayout: 510,
      coopCut: 60,
      welfareCut: 30,
      timestamp: new Date().toISOString()
    }
  ],
  rateFloorVotes: [
    { id: 'VOTE-1', trade: 'Electrician', currentFloor: 300, proposedFloor: 350, votesFor: 18, votesAgainst: 4, active: true },
    { id: 'VOTE-2', trade: 'Plumber', currentFloor: 250, proposedFloor: 280, votesFor: 12, votesAgainst: 8, active: true }
  ],
  worker: {
    id: 'W-104',
    name: 'Ravi Kumar',
    initials: 'RK',
    trade: 'Electrician',
    isAvailable: true,
    opportunityScore: 78
  }
};

const CoopStore = {
  get() {
    const data = localStorage.getItem('coopseva_db');
    if (!data) {
      localStorage.setItem('coopseva_db', JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    return JSON.parse(data);
  },

  set(nextState) {
    localStorage.setItem('coopseva_db', JSON.stringify(nextState));
    window.dispatchEvent(new Event('coopseva_state_updated'));
  },

  createJob(jobData) {
    const state = this.get();
    const newJob = {
      id: 'JOB-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Upcoming',
      grossFee: 500,
      workerPayout: 425,
      coopCut: 50,
      welfareCut: 25,
      timestamp: new Date().toISOString(),
      ...jobData
    };
    state.jobs.unshift(newJob);
    this.set(state);
    return newJob;
  },

  castRateVote(voteId, inFavor) {
    const state = this.get();
    state.rateFloorVotes = state.rateFloorVotes.map(v => {
      if (v.id === voteId) {
        return inFavor ? { ...v, votesFor: v.votesFor + 1 } : { ...v, votesAgainst: v.votesAgainst + 1 };
      }
      return v;
    });
    this.set(state);
  },

  subscribe(callback) {
    const handler = () => callback(this.get());
    window.addEventListener('storage', handler);
    window.addEventListener('coopseva_state_updated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('coopseva_state_updated', handler);
    };
  }
};

window.CoopStore = CoopStore;