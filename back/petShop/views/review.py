from flask import Blueprint, request, jsonify
from petShop.models import Review

review_bp = Blueprint('review', __name__, url_prefix='/api')

@review_bp.get('/product/<int:product_id>/reviews')
def list_reviews(product_id):
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=8, type=int)
    sort = request.args.get('sort', default='id_desc',type=str)

    q = Review.query.filter(Review.product_id ==product_id)

    if sort == "rating_desc":
        q = q.order_by(Review.rating.desc())
    elif sort == "rating_asc":
        q = q.order_by(Review.rating.asc())
    elif sort == "id_desc":
        q = q.order_by(Review.create_date.desc())
    else:
        q = q.order_by(Review.create_date.desc())

    total =q.count()
    items = (q.offset((page - 1) * limit).limit(limit).all())

    return jsonify({
        "items": [r.to_dict() for r in items],
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": (total + limit - 1) // limit
    })