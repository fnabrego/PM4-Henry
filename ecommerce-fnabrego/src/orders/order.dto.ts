import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ArrayMinSize, IsUUID } from 'class-validator';
import { Products } from 'src/entities/products.entity';

export class CreateOrderDto {

    /**
     *Debe ser un string de máximo 50 caracteres,
     correspondiente al uuid de un usuario existente
     *@example 'c527bd36-2877-4ebc-88a6-9ccc9d1e8e66'
     */
     @ApiProperty({
        description: 'Debe ser un string de máximo 50 caracteres, correspondiente al uuid de un usuario existente',
        example: [
          { id: 'dbec309b-7caa-40ee-950f-65d0a9d8dee8' },
          { id: '5b296c32-181b-4c62-bcdf-c8490529ab87' }
        ]
      })
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'Debe ser un array de objetos, donde cada uno debe tener de máximo 50 caracteres, correspondiente al uuid de un producto existente',
        example: [
          { id: 'dbec309b-7caa-40ee-950f-65d0a9d8dee8' },
          { id: '5b296c32-181b-4c62-bcdf-c8490529ab87' }
        ]
      })
    @IsArray()
    @ArrayMinSize(1)
    products: Partial<Products[]>;

}