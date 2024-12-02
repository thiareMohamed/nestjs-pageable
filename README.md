# NestJS Pageable

## Introduction

La bibliothèque **NestJS Pageable** est conçue pour faciliter l'implémentation de la pagination dans les projets NestJS, inspirée de l'interface `Pageable` de Spring. Elle prend en charge **TypeORM** et **Mongoose**, et fournit une approche simple et flexible pour la gestion de la pagination.

## Fonctionnalités

- Support pour **TypeORM** et **Mongoose**.
- Structure de réponse standardisée (`Page`).
- Décorateur `@Pageable()` pour extraire les paramètres de pagination depuis les requêtes HTTP.
- Design Pattern *Façade* pour simplifier l'usage.
- Configuration minimale et personnalisable.

## Installation

### Installation via npm

Pour installer la bibliothèque, ajoute-la comme dépendance dans ton projet :

```bash
npm install nestjs-pageable
```

### Dépendances
Si tu utilises TypeORM ou Mongoose, assure-toi qu'ils sont installés dans ton projet
  
```bash
npm install @nestjs/typeorm typeorm
npm install @nestjs/mongoose mongoose
```

## Structure des Dossiers
La bibliothèque suit cette structure de fichiers :
  
  ```
  src/
├── decorators/                 # Décorateurs
│   └── pageable.decorator.ts
├── dto/                        # Objets de transfert de données
│   ├── page.dto.ts
│   ├── pageable.dto.ts
├── interfaces/                 # Interfaces pour les stratégies
│   └── pagination.interface.ts
├── strategies/                 # Stratégies de pagination
│   ├── typeorm.strategy.ts
│   ├── mongoose.strategy.ts
├── services/                   # Service principal (façade)
│   └── pagination.facade.ts
├── pagination.module.ts        # Module principal
```

### Mise en œuvre
#### 1. Ajout du Module
Ajoute le module de pagination dans ton module principal ou dans n'importe quel module de ton application :

```typescript
import { Module } from '@nestjs/common';
import { PaginationModule } from 'nestjs-pageable';

@Module({
  imports: [
    PaginationModule,
    // Autres modules
  ],
})
export class AppModule {}
```

#### 2. Utilisation avec TypeORM

##### a. Service
Dans ton service, utilise le PaginationFacade pour la pagination :
  
```typescript
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PaginationFacade } from 'nestjs-pageable';
import { Page } from 'nestjs-pageable/dto/page.dto';
import { PageableDto } from 'nestjs-pageable/dto/pageable.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationFacade: PaginationFacade,
  ) {}

  async getUsers(pageable: PageableDto): Promise<Page<User>> {
    return this.paginationFacade.paginate<User>(this.userRepository, pageable);
  }
}
```

##### b. Contrôleur
Dans ton contrôleur, utilise le décorateur `@Pageable()` :

```typescript
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Page } from 'nestjs-pageable/dto/page.dto';
import { User } from './entities/user.entity';
import { Pageable } from 'nestjs-pageable/decorators/pageable.decorator';
import { PageableDto } from 'nestjs-pageable/dto/pageable.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Pageable() pageable: PageableDto): Promise<Page<User>> {
    return this.userService.getUsers(pageable);
  }
}
```
#### 3. Utilisation avec Mongoose
##### a. Service
Dans le cas de Mongoose, utilise un modèle Mongoose au lieu d'un repository TypeORM :
  
```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'; // Exemple de schéma
import { PaginationFacade } from 'nestjs-pageable';
import { Page } from 'nestjs-pageable/dto/page.dto';
import { PageableDto } from 'nestjs-pageable/dto/pageable.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly paginationFacade: PaginationFacade,
  ) {}

  async getUsers(pageable: PageableDto): Promise<Page<User>> {
    return this.paginationFacade.paginate<User>(this.userModel, pageable, {
      filter: {}, // Ajoute des filtres si nécessaire
    });
  }
}
```

##### b. Contrôleur
Le contrôleur avec Mongoose est identique à celui de TypeORM :
  
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Pageable() pageable: PageableDto): Promise<Page<User>> {
    return this.userService.getUsers(pageable);
  }
}
```

## Requête et Résultat
### Requête GET
Voici un exemple de requête HTTP avec les paramètres de pagination :
  
```json
{
"data": [
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
],
"totalElements": 50,
"currentPage": 1,
"size": 10,
"totalPages": 5
}
```

## Personnalisation
### Filtrage Avancé
#### TypeORM
Tu peux ajouter des filtres personnalisés ou des requêtes supplémentaires en utilisant la méthode `paginate` :

```typescript
this.paginationFacade.paginate<User>(this.userRepository, pageable, {
  alias: 'user',
  customQuery: (qb) => qb.where('user.isActive = :isActive', { isActive: true }),
});
```

#### Mongoose
Pour Mongoose, tu peux ajouter des filtres personnalisés ou des requêtes supplémentaires en utilisant la méthode `paginate` :

```typescript
this.paginationFacade.paginate<User>(this.userModel, pageable, {
  filter: { isActive: true },
  projection: { name: 1, email: 1 },
});
```
## Tests Unitaires
Pour tester ton contrôleur et service, tu peux simuler les appels à la pagination.

### Mock PaginationFacade
```typescript
const mockPaginationFacade = {
  paginate: jest.fn().mockResolvedValue(new Page([], 0, 1, 10)),
};
```

#### Exemple de Test
```typescript
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: PaginationFacade, useValue: mockPaginationFacade },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should return paginated users', async () => {
    const result = await controller.findAll({ page: 1, size: 10 });
    expect(result).toEqual(new Page([], 0, 1, 10));
    expect(mockPaginationFacade.paginate).toHaveBeenCalled();
  });
});
```

## Conclusion
Ta bibliothèque NestJS Pageable permet d'ajouter facilement la pagination à ton projet NestJS. Elle est conçue pour fonctionner à la fois avec TypeORM et Mongoose, et son design est basé sur le pattern Façade pour rendre l'utilisation simple et efficace.

## Auteur
L'auteur de ce guide est `thiare`, un développeur passionné de NestJS

## Licence
Ce projet est sous licence MIT
```

---

Ce fichier `README.md` contient toute la documentation nécessaire pour comprendre, installer, et utiliser la bibliothèque **NestJS Pageable** dans un projet.
```
