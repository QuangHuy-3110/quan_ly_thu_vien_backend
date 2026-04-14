const { ObjectId } = require('mongodb');

class SachService {
    constructor(client) {
        this.Sach = client.db().collection('sach');
    }
//    dinh ngia cac phuong thuc
    extractSachData(payload) {
        const sach = {
            _id: payload._id,
            tenSach: payload.tenSach,
            soquyenSach: payload.soquyenSach,
            namXB: payload.namXB,
            maNXB: payload.maNXB,
            tacgia: payload.tacgia,
            hinhanh: payload.hinhanh,
        };
        // remove undefined fields
        Object.keys(sach).forEach(
            (key) => sach[key] === undefined && delete sach[key]
        );
        return sach;
    }

    async create(payload) {
        
        const sach = this.extractSachData(payload);
        
        // const result = await this.Sach.findOneAndUpdate(
        //     sach,
        //     { $set: sach },
        //     { returnDocument: 'after', upsert: true }
        //     );

        // Kiểm tra nếu sách đã tồn tại
        const existingSach = await this.Sach.findOne({ _id: sach._id });
        if (existingSach) {
            throw new Error('Sách đã tồn tại!');
        }
        return result;
    }


    async find (filter) {
        const cursor = this.Sach.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            tenSach: {$regex: new RegExp(new RegExp(name)), $options: 'i'}
        });
    }

    async findById(id) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error('Invalid ObjectId');
        // }
        
        try {
            const sach = await this.Sach.findOne({
                _id: id,
            });
            if (!sach) {
                console.error('Không tìm thấy sách với:', id);
                throw new Error('Không tìm thấy sách với id');
            }
            return sach;
        } catch (error) {
            console.error('Có lỗi xảy ra khi tìm kiếm sách:', error);
            throw error;
        }
    }

    async update(id, payload) {
        const filter = {
            _id: id ? id : null,
        };    
        const update = this.extractSachData(payload);
        const result = await this.Sach.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result.updatedExisting;
    }

    async delete(id) {
        const result = await this.Sach.findOneAndDelete({
            _id: id ? id : null,
        });
        return result;
    }

    async deleteAll (){
        const result = await this.Sach.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = SachService;