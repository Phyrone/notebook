import type {
	Invalidator,
	Readable,
	Subscriber,
	Unsubscriber,
	Updater,
	Writable
} from 'svelte/store';
//import type PouchDB from "pouchdb";
export type PouchDatabase = PouchDB.Database;

export type DocumentBase = {
	_id?: string;
	_rev?: string;
};

export function pouchDbWritable<T extends DocumentBase>(
	database: PouchDatabase,
	document_id: string
): PouchDbDocumentWritable<T> {
	return new PouchDbDocumentWritable<T>(database, document_id);
}

export function pouchDbReadable<T extends DocumentBase>(
	database: PouchDatabase,
	document_id: string
): PouchDBReadable<T> {
	return new PouchDBReadable<T>(database, document_id);
}

export class PouchDBReadable<T extends DocumentBase> implements Readable<T | undefined> {
	protected current_value?: T;
	private subscribers: Array<{
		run: Subscriber<T | undefined>;
		invalidate?: Invalidator<T | undefined>;
	}> = [];
	protected changes?: PouchDB.Core.Changes<T>;

	constructor(
		public readonly database: PouchDB.Database,
		public readonly document_id: string
	) {}

	protected new_value(new_value: T | undefined) {
		const rollout_value = structuredClone(new_value);
		this.subscribers.forEach((sub) => {
			if (sub.invalidate) sub.invalidate(this.current_value);
		});
		this.current_value = new_value;
		this.subscribers.forEach((sub) => sub.run(rollout_value));
	}

	protected start() {
		if (this.changes) return;
		this.changes = this.database.changes({
			since: this.current_value?._rev || 0,
			include_docs: true,
			binary: true,
			live: true,
			doc_ids: [this.document_id]
		});
		this.changes.on('change', (event) => {
			this.new_value(event.deleted ? undefined : (event.doc as T));
		});
	}

	protected stop() {
		this.changes?.cancel();
		this.changes = undefined;
	}

	subscribe(run: Subscriber<T | undefined>, invalidate?: Invalidator<T | undefined>): Unsubscriber {
		const entry = { run, invalidate };
		this.subscribers.push(entry);
		run(this.current_value ? structuredClone(this.current_value) : undefined);
		if (this.subscribers.length === 1) this.start();
		return () => {
			const index = this.subscribers.indexOf(entry);
			if (index !== -1) this.subscribers.splice(index, 1);
			if (this.subscribers.length === 0) this.stop();
		};
	}
}

/**
 * A writable store adapter for a PouchDB document.
 *
 */
export class PouchDbDocumentWritable<T extends DocumentBase>
	extends PouchDBReadable<T>
	implements Writable<T | undefined>
{
	constructor(database: PouchDB.Database, document_id: string) {
		super(database, document_id);
	}

	set(value: T | undefined): void {
		if (!this.current_value === !value && Object.is(this.current_value, value)) {
			console.debug('PouchDbDocumentWritable.set', 'skipped', this.current_value, '==', value);
			return;
		}

		if (value) {
			console.debug('PouchDbDocumentWritable.set', this.current_value, '->', value);
			this.database
				.put({
					...value,
					_id: this.document_id
				})
				.then();
		} else {
			console.debug('PouchDbDocumentWritable.set', 'remove');
			if (this.current_value?._rev) {
				this.database.remove(this.document_id, this.current_value._rev).then();
			} else {
				console.warn('PouchDbDocumentWritable.set', 'remove', 'no _rev');
			}
		}
		this.new_value(value);
	}

	update(updater: Updater<T | undefined>): void {
		this.database.get(this.document_id).then((doc) => {
			const new_value = updater(doc as T);
			this.set(new_value);
		});
	}
}
