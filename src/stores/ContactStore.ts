import axios from 'axios';

class ContactStore {
    private availableContacts?: [];
    private incomingRequests?: [];
    private outgoingRequests?: [];
    private contacts?: [];
    private notificationCount?: number;

    public clear() {
        this.availableContacts = [];
        this.incomingRequests = [];
        this.outgoingRequests = [];
        this.contacts = [];
    }

    public getIncomingAndOutGoingRequests(userId: number) {
        return {
            inComingRequests: this.incomingRequests,
            outGoingRequests: this.outgoingRequests,
            onChange: async (callback: ([], []) => void) => {
                if (this.incomingRequests && this.outgoingRequests) {
                    callback(this.incomingRequests, this.outgoingRequests);
                }
                const {data: incomingRequests} = await axios.get('/contacts/incoming/' + userId);
                incomingRequests.forEach((request: any) => {
                    request.type = 'Incoming';
                });
                const {data: outgoingRequests} = await axios.get('/contacts/outgoing/' + userId);
                callback(incomingRequests, outgoingRequests);
            },
        };
    }

    public getAvailableContacts(userId: number) {
        return {
            contacts: this.availableContacts,
            onChange: async (callback: ([]) => void) => {
                if (this.availableContacts) {
                    callback(this.availableContacts);
                }
                const {data: contacts} = await axios.get('/contacts/all/' + userId);
                this.availableContacts = contacts;
                callback(contacts);
            },
        };
    }

    public getPersonContacts(userId: number) {
        return {
            contacts: this.contacts,
            onChange: async (callback: ([]) => void) => {
                if (this.contacts) {
                    callback(this.contacts);
                }
                const {data: contacts} = await axios.get('/contacts/' + userId);
                this.contacts = contacts;
                callback(contacts);
            },
        };
    }

    public getContactsNotificationCount(userId: number) {
        return {
            count: this.notificationCount,
            onChange: async (callback: (count: number) => void) => {
                if (this.notificationCount) {
                    callback(this.notificationCount);
                }
                const {data: incomingRequests} = await axios.get('/contacts/incoming/' + userId);
                this.notificationCount = incomingRequests.length;
                callback(incomingRequests.length);
            },
        };
    }
}

const contactStore = new ContactStore();

export default contactStore;
