
// const { name } = require("body-parser");
// const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema(
    {
        sku : {type:String, required:true, unique:true},
        name : {type:String, required:true},
        size : {type:String, required:true, default: 'Medium'},
        image : {type:String, required:true},
        category: {type:Array, required:true},
        description : {type:String, required:true},
        price:{type:Number, required:true},
        stock: {type:Object, required:true},
        status : {type:String, default:"active"},
        isDeleted : {type:Boolean, default:false} , //상품을 실제 삭제하는것이 아니라 상품이 삭제 되었는지 아닌지 보여주는 기능
    },
{timestamps:true}
);

productSchema.methods.toJSON = function(){
    const obj = this._doc;
    delete obj.updateAt;
    return obj;
}

const Product = mongoose.model("Product",productSchema);
module.exports = Product;