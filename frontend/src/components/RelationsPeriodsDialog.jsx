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
 * Displays a dialog showing the various relations associated with a period.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Function to call when closing the dialog.
 * @param {object} props.period - The period whose relations are to be displayed.
 * @returns The dialog component.
 *
 * Pre-condition: The period object must contain arrays for each type of relation.
 * Post-condition: Renders a dialog showing lists of relations or a message if there are none.
 */
export default function RelationsPeriodsDialog({ open, onClose, period }) {
	if (!period) return null;

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
			<DialogTitle>{period.name} Relations</DialogTitle>
			<DialogContent>
				{renderRelationList(period.cultures, "Cultures")}
				{renderRelationList(period.bladeShapes, "Blade Shape")}
				{renderRelationList(period.baseShapes, "Base Shape")}
				{renderRelationList(period.haftingShapes, "Hafting Shape")}
				{renderRelationList(period.crossSections, "Cross Section")}
				{renderRelationList(period.materials, "Materials")}

				{!period.cultures?.length &&
					!period.bladeShapes?.length &&
					!period.baseShapes?.length &&
					!period.haftingShapes?.length &&
					!period.crossSections?.length &&
					!period.materials?.length && (
						<Typography>No relations found for this period.</Typography>
					)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
