import logging

logger=logging.getLogger(__name__)


class User():
    async def ensure_exist() -> bool:
        """
        ensure that the user exists in the database 
        """
        sql="""
        INSERT INTO login(sub) 
        VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            )


        """



         return True

    pass
