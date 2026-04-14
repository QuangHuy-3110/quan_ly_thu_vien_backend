const TheodoiService = require('../services/theodoi.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.maDG){
        console.log(req.body?.maDG)
        return next(new ApiError(400, 'Mã độc giả không được bỏ trống'));
    }

    if (!req.body?.maSach){
        return next(new ApiError(400, 'Mã sách không được bỏ trống'));
    }

    try {
        const theodoiService = new TheodoiService(MongoDB.client);        
        const document = await theodoiService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "Có lỗi trong khi theo dõi mới")
        );
    }

}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const {maDG} = req.query;
        const {maSach} = req.query;
        const {ngaymuon} = req.query;
        const {trangthai} = req.query;
        if (maDG) {
            documents = await theodoiService.findByMaDG(maDG);
        }else if (maSach) {
            documents = await theodoiService.findByMaSach(maSach);
        }else if (ngaymuon) {
            documents = await theodoiService.findByNgayMuon(ngaymuon);
        } else if (trangthai) {
            documents = await theodoiService.findByTrangthai(trangthai);
        } else{
            documents = await theodoiService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, 'Có lỗi xảy ra khi tìm theo dõi')
        );
    }
    return res.send(documents); 
};

exports.findOne = async (req, res, next) => {
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        
        const document = await theodoiService.findById(req.params.id);
        
        if (!document) {
            return next(new ApiError(404, 'Lịch sử không tồn tại'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Có lỗi xảy ra trong khi tìm kiếm id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cập nhật không được để trống'));
    }

    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const document = await theodoiService.update(req.params.id, req.body);
        if (document) {
            return next(new ApiError(404, 'Lịch sử mượn không tồn tại'));
        }
        return res.send({message: 'Sổ mượn được cập nhật thành công'});	
    }catch (error){
        return next(
            new ApiError(500,`Có lỗi xảy ra trong khi cập nhật id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const document = await theodoiService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Lịch sử mượn không tồn tại'));
        }
        return res.send({message: 'Lịch sử mượn được xóa thành công'});
    }catch (error){
        return next(
            new ApiError(500, `Có lỗi xảy ra trong khi xóa id=${req.params.id}`)
        );
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const deletedCount = await theodoiService.deleteAll();
        return res.send({
            message: `${deletedCount} theo dõi được xóa thành công`
        });
    } catch (error){
        return next (
            new ApiError(500, 'Có lỗi xảy ra trong khi xóa')
        );
    }
}