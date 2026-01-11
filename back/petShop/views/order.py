from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from petShop.models import Order, OrderItem  # ✅ OrderItem 필요

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@order_bp.route('', methods=['GET'])
@jwt_required()
def list_orders():
    current_user = get_jwt_identity()  # ⚠️ 이 값이 User.id(int)라고 가정

    orders = (
        Order.query
        .filter(Order.user_id == current_user)
        .order_by(Order.ordered_date.desc())
        .all()
    )

    result = []
    for o in orders:
        items_payload = []

        # ✅ 새 구조: o.items 안에 OrderItem들이 있음
        for it in o.items:
            # product 관계를 쓰거나, snapshot을 우선 사용
            p = getattr(it, "product", None)

            title = it.product_name or (p.title if p else None)
            img_url = it.product_image or (p.img_url if p else None)

            unit_price = it.unit_price or (p.price if p else 0)
            line_price = unit_price * it.qty

            items_payload.append({
                "id": it.id,                 # ✅ order_item id
                "product_id": it.product_id,
                "img_url": img_url,
                "title": title,
                "qty": it.qty,               # ✅ 수량(추천)
                "price": line_price,         # 팀원 코드처럼 “총가격”을 price에 넣음
            })

        result.append({
            "order_Id": o.id,
            "ordered_date": o.ordered_date.strftime("%Y-%m-%d"),
            "items": items_payload
        })

    return jsonify(result)
