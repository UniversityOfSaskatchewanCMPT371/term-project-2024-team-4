/* eslint-disable indent */
/* eslint-disable react/prop-types */
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";

/**
 * Displays a dialog showing the various relations associated with a culture.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Function to call when closing the dialog.
 * @param {object} props.culture - The culture whose relations are to be displayed.
 * @returns The dialog component.
 *
 * Pre-condition: The culture object must contain arrays for each type of relation.
 * Post-condition: Renders a dialog showing lists of relations or a message if there are none.
 */
export default function RelationsCultureDialog({ open, onClose, culture }) {
	if (!culture) return null;

	// Render a list of items with a title for a specific relation type.
	const renderRelationList = (items, title) => {
		if (items?.length > 0) {
			return (
				<>
					<Typography variant="h6" style={{ marginTop: 20 }}>
						{title}
					</Typography>
					<List>
						{items.map((item) => (
							<ListItem key={item.id}>
								<ListItemText primary={item.name} secondary={item.location} />
							</ListItem>
						))}
					</List>
				</>
			);
		}
		return null; // Return null if there are no items to display
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{culture.name} Relations</DialogTitle>
			<DialogContent>
				{renderRelationList(culture.projectilePoints, "Projectile Points")}
				{renderRelationList(culture.bladeShapes, "Blade Shape")}
				{renderRelationList(culture.baseShapes, "Base Shape")}
				{renderRelationList(culture.haftingShapes, "Hafting Shape")}
				{renderRelationList(culture.crossSections, "Cross Section")}
				{renderRelationList(culture.materials, "Materials")}

				{!culture.projectilePoints?.length &&
					!culture.bladeShapes?.length &&
					!culture.baseShapes?.length &&
					!culture.haftingShapes?.length &&
					!culture.crossSections?.length &&
					!culture.materials?.length && (
						<Typography>No relations found for this culture.</Typography>
					)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
