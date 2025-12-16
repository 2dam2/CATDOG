import React from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


// App.jsx에 const [products, setProducts] = useState(seed파일이름)
// Route path = "/category/:pet_type/:category?" element = { <Category products={products}, setProducts={setProducts} />}
//                                        ?는 있을 수도 없을 수도 있다

const Category = (props) => {
    const { products, setProducts } = props;
    // const navigate = useNavigate();

    return (
        <>
            <div>
                {/* localeCompare = 문자열 정렬을 위한 비교함수 (JS 기본기능) */}
                <Button variant="light" onClick={() => {
                    let copy = [...products]
                    copy.sort((a, b) => a.title.localeCompare(b.title))
                    setProducts(copy)
                }}>이름순 정렬</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...products]
                    copy.sort((a, b) => (a.views > b.views) ? 1 : -1)
                    setProducts(copy)
                }}>조회순</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...products]
                    copy.sort((a, b) => (a.review_count < b.review_count) ? 1 : -1)
                    setProducts(copy)
                }}>리뷰 많은 순</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...products]
                    copy.sort((a, b) => (a.price > b.price) ? 1 : -1)
                    setProducts(copy)
                }}>낮은 가격 순</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...products]
                    copy.sort((a, b) => (a.price < b.price) ? 1 : -1)
                    setProducts(copy)
                }}>높은 가격 순</Button>
            </div>
            <Container>
                <Row>
                    {products.map((item) =>
                        <Col xl={5} sm={3} key={item.id} onClick={() => { }} >
                            {/* process.env.PUBLIC_URL = public 폴더 안 파일을 가져올 때 쓰는 절대경로 => react가 자동으로 올바름 public경로를 붙여줌
                                ∵ 개발환경 / 배포환경에서 경로가 달라질 수 있기 때문 */}
                            <img src={process.env.PUBLIC_URL + item.imgUrl} alt="상품이미지" />
                            <h4>{item.title}</h4>
                            <p>{item.price}</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    )
}

export default Category