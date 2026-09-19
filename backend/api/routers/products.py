from fastapi import APIRouter

router = APIRouter()

@router.get("/products")
async def get_products():
    return [
        {
            "id": "1",
            "name": "Wireless Mouse",
            "description": "Ergonomic 2.4GHz wireless mouse with adjustable DPI.",
            "heroImg": "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
        },
        {
            "id": "2",
            "name": "Mechanical Keyboard",
            "description": "RGB mechanical keyboard with tactile blue switches.",
            "heroImg": "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
        },
    ]