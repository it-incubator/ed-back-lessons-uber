/**
 * @swagger
 * tags:
 *   name: Testing
 *   description: For API testing
 */

/**
 * @swagger
 * /api/testing/all-data:
 *   delete:
 *     summary: "Clear database: delete all data from all tables/collections"
 *     tags: [Testing]
 *     responses:
 *       204:
 *         description: All data deleted
 */

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: API for managing vehicles
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - driver
 *         - number
 *         - status
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 15
 *           example: Tesla Model S
 *         driver:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *           example: John Doe
 *         number:
 *           type: integer
 *           example: 12345
 *         description:
 *           type: string
 *           nullable: true
 *           minLength: 10
 *           maxLength: 200
 *           example: "Luxury electric vehicle"
 *           default: null
 *         status:
 *           type: string
 *           enum: [awaiting-order, on-order, on-pause]
 *           example: awaiting-order
 *           default: awaiting-order
 *         features:
 *           type: array
 *           items:
 *             type: string
 *             enum: [pet-friendly, child-seat, wi-fi]
 *           nullable: true
 *           example: child-seat
 *           description: "List of features. Must contain at least one value if exist."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-02-20T12:00:00Z"
 *     VehicleInputDto:
 *       type: object
 *       required:
 *         - name
 *         - driver
 *         - number
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 15
 *         driver:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *         number:
 *           type: integer
 *         description:
 *           type: string
 *           nullable: true
 *           minLength: 10
 *           maxLength: 200
 *           example: null
 *           default: null
 *         features:
 *           type: array
 *           items:
 *             type: string
 *             enum: [pet-friendly, child-seat, wi-fi]
 *           nullable: true
 *           example: child-seat
 *           description: "List of features. Must contain at least one value if exist."
 *     VehicleStatusUpdateDto:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [awaiting-order, on-order, on-pause]
 *     ValidationError:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *           example: "name"
 *         message:
 *           type: string
 *           example: "Invalid name"
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         errorMessages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValidationError'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInputDto'
 *     responses:
 *       201:
 *         description: The vehicle was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
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
 *     responses:
 *       200:
 *         description: The requested vehicle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *   put:
 *     summary: Update a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInputDto'
 *     responses:
 *       204:
 *         description: Vehicle updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Vehicle not found
 *   delete:
 *     summary: Delete a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/{id}/status:
 *   put:
 *     summary: Update vehicle status by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the vehicle to update status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleStatusUpdateDto'
 *     responses:
 *       204:
 *         description: Vehicle status updated successfully
 *       400:
 *         description: Incorrect status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Vehicle not found
 */
