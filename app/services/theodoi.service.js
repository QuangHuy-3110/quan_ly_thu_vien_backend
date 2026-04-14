const { ObjectId } = require('mongodb');

class TheodoiService {
    constructor(client) {
        this.Theodoi = client.db().collection('theodoi');
    }
//    dinh ngia cac phuong thuc
    extractTheodoiData(payload) {
        const theodoi = {
            maSach: payload.maSach,
            maDG: payload.maDG,
            maNV: payload.maNV,
            ngaymuon: payload.ngaymuon,
            trangthai: payload.trangthai,
            ngaytra: payload.ngaytra,
        };
        // remove undefined fields
        Object.keys(theodoi).forEach(
            (key) => theodoi[key] === undefined && delete theodoi[key]
        );
        return theodoi;
    }

    async create(payload) {
        
        const theodoi = this.extractTheodoiData(payload);
        
        const result = await this.Theodoi.findOneAndUpdate(
            theodoi,
            { $set: theodoi},
            { returnDocument: 'after', upsert: true }
            );
        return result;
    }


    async find (filter) {
        const cursor = this.Theodoi.find(filter);
        return await cursor.toArray();
    }

    async findByMaDG(ma) {
        return await this.find({
            maDG: {$regex: new RegExp(new RegExp(ma)), $options: 'i'}
        });
    }

    async findByMaSach(ma) {
        return await this.find({
            maSach: {$regex: new RegExp(new RegExp(ma)), $options: 'i'}
        });
    }

    async findByTrangthai(tt) {
        return await this.find({
            trangthai: {$regex: new RegExp(new RegExp(tt)), $options: 'i'}
        });
    }

    async findByNgayMuon(ngay) {
        return await this.find({
            ngaymuon: {$regex: new RegExp(new RegExp(ngay)), $options: 'i'}
        });
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid ObjectId');
        }
        
        try {
            const theodoi = await this.Theodoi.findOne({
                _id: new ObjectId(id),
            });
            if (!theodoi) {
                console.error('Không tìm thấy thông tin với:', id);
                throw new Error('Không tìm thấy thông tin với id');
            }
            return theodoi;
        } catch (error) {
            console.error('Có lỗi xảy ra khi tìm thông tin:', error);
            throw error;
        }
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };    
        const update = this.extractTheodoiData(payload);
        const result = await this.Theodoi.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result.updatedExisting;
    }

    async delete(id) {
        const result = await this.Theodoi.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll (){
        const result = await this.Theodoi.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = TheodoiService;