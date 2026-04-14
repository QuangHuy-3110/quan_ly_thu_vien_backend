const { ObjectId } = require('mongodb');

class NXBService {
    constructor(client) {
        this.NXB = client.db().collection('nxb');
    }
//    dinh ngia cac phuong thuc
    extractNXBData(payload) {
        const nxb = {
            _id: payload._id,
            tenNXB: payload.tenNXB,
            diachiNXB: payload.diachiNXB,
        };
        // remove undefined fields
        Object.keys(nxb).forEach(
            (key) => nxb[key] === undefined && delete nxb[key]
        );
        return nxb;
    }

    async create(payload) {
        
        const nxb = this.extractNXBData(payload);
        
        // const result = await this.NXB.findOneAndUpdate(
        //     nxb,
        //     { $set: nxb },
        //     { returnDocument: 'after', upsert: true }
        //     );

        // Kiểm tra nếu NXB đã tồn tại
        const existingNXB = await this.NXB.findOne({ _id: nxb._id });
        if (existingNXB) {
            throw new Error('NXB đã tồn tại!');
        }
        return result;
    }


    async find (filter) {
        const cursor = this.NXB.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            tenNXB: {$regex: new RegExp(new RegExp(name)), $options: 'i'}
        });
    }

    async findById(id) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error('Invalid ObjectId');
        // }
        
        try {
            const nxb = await this.NXB.findOne({
                _id: id,
            });
            if (!nxb) {
                console.error('Không tìm thấy NXB với:', id);
                throw new Error('Không tìm thấy NXB với id');
            }
            return nxb;
        } catch (error) {
            console.error('Có lỗi xảy ra khi tìm kiếm NXB:', error);
            throw error;
        }
    }

    async update(id, payload) {
        const filter = {
            _id: id ? id : null,
        };    
        const update = this.extractNXBData(payload);
        const result = await this.NXB.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result.updatedExisting;
    }

    async delete(id) {
        const result = await this.NXB.findOneAndDelete({
            _id: id ? id : null,
        });
        return result;
    }

    async deleteAll (){
        const result = await this.NXB.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = NXBService;