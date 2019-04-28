import axios from 'axios';

class EventStore {
    private events?: [];

    public clear() {
        this.events = [];
    }

    public getUserEvents(userId: number) {
        return {
            events: this.events,
            onChange: async (callback: ([]) => void) => {
                if (this.events) {
                    callback(this.events);
                }
                const {data: events} = await axios.get('/events/user/' + userId);
                this.events = events;
                callback(events);
            },
        };
    }
}

const eventStore = new EventStore();

export default eventStore;
