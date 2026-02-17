from password_generators.diceware_pure import DicewarePureGenerator
from password_generators.diceware_modified import DicewareModifiedGenerator
from password_generators.random_classic import RandomClassicGenerator


def get_generators(app_context):
    """
    Retorna a lista de geradores disponíveis.
    Nenhuma lógica deve ser executada aqui além da criação dos objetos.
    """
    return [
        DicewarePureGenerator(app_context),
        DicewareModifiedGenerator(app_context),
        RandomClassicGenerator(app_context),
    ]
