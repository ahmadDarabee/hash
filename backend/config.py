from pydantic_settings import BaseSettings
from cachetools import cached, LRUCache
import logging


class Settings(BaseSettings):
    log_config= "/app/log_conf.yaml"
    log_level: str = 'DEBUG'
    dbname: str ='testoo'
    dbhost: str = 'localhost'
    


@cached(cache=LRUCache())
def get_setting():
    return Settings()



class CustomFormatter(logging.Formatter):
    """
    Now these are ANSI Escape Code Format, we use it to add colors and styling on the printed text
    \x1b[<style>;<color>m
    \x1b → Escape character (ESC)
    [<style>;<color>m → ANSI code for foreground color and style
    
    <reset = "\x1b[0m"> -> ensures that colors don’t persist beyond their intended text.
    """
   

    grey = "\x1b[38m"
    dark_green = "\x1b[32m"
    cyan = "\x1b[36m"
    yellow = "\x1b[33m"
    red = "\x1b[31m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    format = (
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s (%(filename)s:%(lineno)d)"
    )

    FORMATS = {
        logging.DEBUG: cyan + format + reset,
        logging.INFO: dark_green + format + reset,
        logging.WARNING: yellow + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: bold_red + format + reset,
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)




