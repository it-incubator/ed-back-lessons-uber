/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: API for managing vehicles
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get a list of all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of all vehicles
 */

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the vehicle to retrieve
 *     responses:
 *       200:
 *         description: The requested vehicle
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tesla Model S
 *               driver:
 *                 type: string
 *                 example: John Doe
 *               number:
 *                 type: integer
 *                 example: 12345
 *     responses:
 *       201:
 *         description: The vehicle was successfully created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Audi A8
 *               driver:
 *                 type: string
 *                 example: Jane Doe
 *               number:
 *                 type: integer
 *                 example: 67890
 *               status:
 *                 type: string
 *                 enum: [OnOrder, AwaitingOrder, OnPause]
 *     responses:
 *       204:
 *         description: Vehicle updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the vehicle to delete
 *     responses:
 *       204:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */
