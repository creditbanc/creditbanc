import { get_doc, set_doc } from "~/utils/firebase";

export default class Entity {
	_plan_id;

	constructor(entity_id) {
		this.id = entity_id;
	}

	async plan_id() {
		if (this._plan_id) {
			return this.plan_id;
		} else {
			let { plan_id } = await get_doc(["entity", this.id]);
			this._plan_id = plan_id;
			return plan_id;
		}
	}
}
