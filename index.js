/*
	version 1.1
	Update : 2017-06-11
	Update : 2017-11-02  OPCODE minimum 
	자동으로 엠약을 먹어줍니다
*/

const cheackPerMP = 0.6; // 60퍼센트 이하일경우 먹음
const MPitemNumber = 6562;

module.exports = function autoMp(dispatch) {
	let cid = null,
		isCoolTime = false,
		enabled = true;

	//로그인정보
	dispatch.hook('S_LOGIN', 1, event => {
		cid = event.cid;
		enabled = true;

		//사제 정령은 기본적으로 disable
		if (event.model % 100 - 1 == 6 || event.model % 100 - 1 == 7)
			enabled = false;
	});

	//아이템 사용시 쿨타임
	dispatch.hook('S_START_COOLTIME_ITEM', 1, async event => {
		let item = event.item;
		let setCoolTime = event.cooldown;

		if (item == MPitemNumber) {
			isCoolTime = true;
			await sleep(setCoolTime);
			isCoolTime = false;
		}
	});

	//엠피 변화가 있을때
	dispatch.hook('S_PLAYER_CHANGE_MP', 1, event => {
		if (!enabled && isCoolTime) return;

		currentMp = event.currentMp;
		maxMp = event.maxMp;

		if (event.target.equals(cid) && currentMp <= maxMp * cheackPerMP) {
			useItem();
		}
	});

	function sleep(sec) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, sec * 1000);
		});
	}

	function useItem() {
		if (isCoolTime) return;
		dispatch.toServer('C_USE_ITEM', 1, {
			ownerId: cid,
			item: MPitemNumber,
			id: 0,
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: 1,
			unk5: 0,
			unk6: 0,
			unk7: 0,
			x: 0,
			y: 0,
			z: 0,
			w: 0,
			unk8: 0,
			unk9: 0,
			unk10: 0,
			unk11: 1,
		});
	}
};
