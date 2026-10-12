import { load, save} from './storage.js';

class Appstate {
    constructor(){
        this.records = load();
        this.budgetCap = 500.00;
        this.currency = 'USD';
        this.exchangeRates = { USD: 1, EUR:0.92, RWF: 1475 }
    }
    setRecords(newRecords){
        this.records = newRecords;
        save(this.records);
    }

    addRecord(record){
        const timestamp = new Date().toISOString();
        const newEntry = {
            id: 'txn_${Date.now()}',
            createdAt: timestamp,
            updatedAt: timestamp,
            ...record 
        };
        this.records.push(newEntry);
        save(this.records);
        return newEntry;
    }

    updateRecord(id, updatedFields){
        this.records = this.records.map(rec => {
            if(r.id === id){
                return { ...rec,
                    ...updatedFields, 
                    updatedAt: new Date().toISOString() 
                };
            }

            return rec;
        });
    } 

    deleteRecord(id){
        this.records = this.records.filter(rec => rec.id !== id);
        save(this.records);
    }

    setBudgetCap(Cap){
        this.budgetCap = parseFloat(Cap) || 0;
    }
}
export const state = new Appstate();
