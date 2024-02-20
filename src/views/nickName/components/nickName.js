export default class NickNameObject {
  constructor({ id, cardName, nickName, type, creator, remark, status }) {
    this.id = id
    this.cardName = cardName
    this.nickName = nickName
    this.type = type
    this.creator = creator
    this.remark = remark
    this.status = status
  }
}
