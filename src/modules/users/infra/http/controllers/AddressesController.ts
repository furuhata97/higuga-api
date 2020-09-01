import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddAddressService from '@modules/users/services/AddAddressService';
import UpdateAddressService from '@modules/users/services/UpdateAddressService';
import DeleteAddressService from '@modules/users/services/DeleteAddressService';

export default class AddAddressesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { zip_code, city, address } = request.body;

    const user_id = request.user.id;

    const addAddress = container.resolve(AddAddressService);

    const newAddress = await addAddress.execute({
      user_id,
      zip_code,
      city,
      address,
    });

    return response.json(newAddress);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { address_id, zip_code, city, address } = request.body;
    const user_id = request.user.id;

    const updateAddress = container.resolve(UpdateAddressService);

    const updatedAddress = await updateAddress.execute({
      user_id,
      address_id,
      zip_code,
      city,
      address,
    });

    return response.json(updatedAddress);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { address_id } = request.body;
    const user_id = request.user.id;

    const deleteAddress = container.resolve(DeleteAddressService);

    const deletedAddress = await deleteAddress.execute({
      user_id,
      address_id,
    });

    return response.json(deletedAddress);
  }
}
